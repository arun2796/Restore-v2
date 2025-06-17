using System.Threading.Tasks;
using API.Data;
using API.DataInitial;
using API.Middleware;
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

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

static async void UpdateDatabaseAsync(IHost host)
{
    using (var scope = host.Services.CreateScope())
    {
        var Service = scope.ServiceProvider;
        try
        {
            var context = Service.GetRequiredService<AppDbContext>();
            if (context.Database.IsSqlServer())
            {
                context.Database.Migrate();
            }
            await SeedData.SeedDataAsync(context);
        }
        catch (Exception ex)
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "error occurred while migration or seeding the database");
        }
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

app.UseAuthorization();

app.MapControllers();

UpdateDatabaseAsync(app);

app.Run();

