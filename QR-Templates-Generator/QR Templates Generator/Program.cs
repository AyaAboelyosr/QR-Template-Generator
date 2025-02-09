
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QR_Templates_Generator.Models;
using QR_Templates_Generator.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;



namespace QR_Templates_Generator
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
           builder. Services.AddAutoMapper(typeof(MappingProfile));
            builder.Services.AddSwaggerGen(swagger =>
            {
                //This is to generate the Default UI of Swagger Documentation    
                swagger.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "ASP.NET  Web API",
                    Description = " QR Template Generator"
                });

               
                // To Enable authorization using Swagger (JWT)    
                swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
                });
                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                    new OpenApiSecurityScheme
                    {
                    Reference = new OpenApiReference
                    {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                    }
                    },
                    new string[] {}
                    }
                    });
            });

            builder.Services.AddDbContext<QRDatabaseContext>(options =>
               options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        
            builder.Services.AddScoped<IGenericRepository<QRTemplateSection>,GenericRepository<QRTemplateSection>>();
            builder.Services.AddScoped<IGenericRepository<QRTemplateSectionField>,GenericRepository<QRTemplateSectionField>>();
            builder.Services.AddScoped<IQRTemplateSectionFieldRepository,QRTemplateSectionFieldRepository>();
            builder.Services.AddScoped<IQRRecordSectionFieldValueRepository, QRRecordSectionFieldValueRepository>();
            builder.Services.AddScoped<IQRRecordRepository, QRRecordRepository>();

            builder.Services.AddScoped<IQRTemplateRepository, QRTemplateRepository>();
          

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy",
                                  policy => policy.AllowAnyMethod()
                                  .AllowAnyOrigin()
                                  .AllowAnyHeader());
            });
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<QRDatabaseContext>()
    .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
                };
            });
            var app = builder.Build();
            app.UseCors("MyPolicy");


            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
