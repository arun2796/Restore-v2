using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Extension;
using API.Model;
using API.RequestHelper;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController(AppDbContext dbContext, IMapper mapper
    , ImageServices imageServices) : BaseApiController
    {
        private readonly AppDbContext _dbContext = dbContext;

        [HttpGet]

        public async Task<ActionResult<IEnumerable<Product>>> GetAllProduct([FromQuery] ProductParams productParams)
        {
            var query = _dbContext.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchName)
            .Filter(productParams.Brands, productParams.Types).AsQueryable();

            var product = await PageList<Product>.ToPageList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationheader(product.MetaData);
            return product;
            // return Ok(new { item = product, product.MetaData });
        }
        [HttpGet("filter")]
        public async Task<IActionResult> GetFilter()
        {
            var brand = await _dbContext.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var Type = await _dbContext.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new { brand, Type });
        }
        [HttpGet("{id}")]

        public async Task<ActionResult<Product>> GetByIdProduct(int id)
        {
            var context = await _dbContext.Products.FirstOrDefaultAsync(x => x.Id == id);

            if (context == null)
            {
                return NotFound("No record is found");
            }
            return context;
        }
        [Authorize(Roles = "Member")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            var product = mapper.Map<Product>(productDto);
            if (productDto.File != null)
            {
                var imageresult = await imageServices.AddImageAsync(productDto.File);
                if (imageresult.Error != null)
                {
                    return BadRequest(imageresult.Error.Message);
                }
                product.PictureUrl = imageresult.SecureUrl.AbsoluteUri;
                product.PublicId = imageresult.PublicId;
            }

            _dbContext.Products.Add(product);

            try
            {
                var result = await _dbContext.SaveChangesAsync() > 0;
                if (result) return CreatedAtAction(nameof(GetAllProduct), new { Id = product.Id }, product);
                return BadRequest("Problem creating new product");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.InnerException?.Message ?? ex.Message);
            }
        }
        [Authorize(Roles = "Member")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct(UpdateProductDto updateProductDto)
        {
            var product = await _dbContext.Products.FindAsync(updateProductDto.Id);

            if (product == null) return NotFound();

            mapper.Map(updateProductDto, product);
            if (updateProductDto.File != null)
            {
                var imageresult = await imageServices.AddImageAsync(updateProductDto.File);
                if (imageresult.Error != null)
                {
                    return BadRequest(imageresult.Error.Message);
                }
                if (!string.IsNullOrEmpty(product.PublicId))
                {
                    await imageServices.DeleteImageAsync(product.PublicId);
                }
                product.PictureUrl = imageresult.SecureUrl.AbsoluteUri;
                product.PublicId = imageresult.PublicId;
            }

            var result = await _dbContext.SaveChangesAsync() > 0;
            if (result) return NoContent();

            return BadRequest("Problem updating product");
        }
        [Authorize(Roles = "Member")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);

            if (product == null) return NotFound();
            if (!string.IsNullOrEmpty(product.PublicId))
            {
                await imageServices.DeleteImageAsync(product.PublicId);
            }

            _dbContext.Products.Remove(product);

            var result = await _dbContext.SaveChangesAsync() > 0;
            if (result) return Ok();

            return BadRequest("Problem Deleting product");

        }
    }
}
