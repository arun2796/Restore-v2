using System.Threading.Tasks;
using API.Data;
using API.Extension;
using API.Model;
using API.RequestHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : BaseApiController
    {
        private readonly AppDbContext _dbContext;

        public ProductController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

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
        [HttpGet("filter")]

        public async Task<IActionResult> GetFilter()
        {
            var brand = await _dbContext.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var Type = await _dbContext.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new { brand, Type });
        }


    }
}
