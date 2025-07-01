using System.Threading.Tasks;
using API.Data;
using API.DataInitial;
using API.Middleware;
using API.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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

builder.Services.AddTransient<MiddlewareException>();

builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;

}).AddRoles<IdentityRole>()
  .AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

static async void UpdateDatabaseAsync(IHost host)
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

// Update the database and seed data
 UpdateDatabaseAsync(app);

app.Run();

