using API.Data;
using API.DataInitial;
using API.Middleware;
using API.Model;
using API.RequestHelper;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;




var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// builder.Services.Configure<StripeSettings>(builder.Configuration.GetSection("StripeSetting"));
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddControllers();

#region  DBconnection

builder.Services.AddDbContext<AppDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    
}
);
#endregion 

#region  React connection

builder.Services.AddCors(options =>
    options.AddPolicy("CustomPolicy", x =>
        x.WithOrigins("https://localhost:3000").AllowCredentials()
         .AllowAnyHeader()
         .AllowAnyMethod()
    ));
#endregion
builder.Services.AddAutoMapper(cfg =>
{ }, AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddTransient<MiddlewareException>();
builder.Services.AddScoped<PaymentServices>();
builder.Services.AddScoped<ImageServices>();


builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;

}).AddRoles<IdentityRole>()
  .AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

static async Task UpdateDatabaseAsync(IHost host)
{
    using var scope = host.Services.CreateScope();
    var Service = scope.ServiceProvider;
    try
    {
        var context = Service.GetRequiredService<AppDbContext>();
        var userManager = Service.GetRequiredService<UserManager<User>>();
        var roleManager = Service.GetRequiredService<RoleManager<IdentityRole>>();
        if (context.Database.IsSqlServer())
        {
            context.Database.Migrate();
        }
        await SeedData.SeedDataAsync(context, userManager, roleManager);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "error occurred while migration or seeding the database");
    }
}

var app = builder.Build();
app.UseMiddleware<MiddlewareException>();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CustomPolicy");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("/api").MapIdentityApi<User>();
app.MapFallbackToController("Index", "Fallback");

// Update the database and seed data
await UpdateDatabaseAsync(app);

app.Run();

