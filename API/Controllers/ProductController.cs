using System.Threading.Tasks;
using API.Data;
using API.Model;
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

        public async Task<ActionResult<IEnumerable<Product>>> GetAllProduct()
        {
            return await _dbContext.Products.ToListAsync();
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
    }
}
