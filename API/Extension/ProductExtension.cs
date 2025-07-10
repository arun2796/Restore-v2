using System;
using API.Model;
using Microsoft.IdentityModel.Tokens;

namespace API.Extension;
public static class ProductExtension
{
    public static IQueryable<Product>Sort(this IQueryable<Product> products, string? OrderBy)
    {
        products = OrderBy switch
        {
            "price" => products.OrderBy(x => x.Price),
            "pricedesc" => products.OrderByDescending(x => x.Price),
            _ => products.OrderBy(x => x.Name)
        };
        return products;
    }
    public static IQueryable<Product> Search(this IQueryable<Product> products, string? searchName)
    {
        if (string.IsNullOrEmpty(searchName)) return products;

        var lowerCaseSearchTerm = searchName.Trim().ToLower();
        return products.Where(x => x.Name.Contains(lowerCaseSearchTerm));
    }
    public static IQueryable<Product> Filter(this IQueryable<Product> products, string? brand, string? type)
    {
        var brandList = new List<string>();
        var typeList = new List<string>();

        if (!string.IsNullOrEmpty(brand))
        {
            brandList.AddRange(brand.ToLower().Split(",").ToList());
        }
        if (!string.IsNullOrEmpty(type))
        {
            typeList.AddRange(type.ToLower().Split(",").ToList());
        }

        products = products.Where(x => brandList.Count == 0 || brandList.Contains(x.Brand.ToLower()));
        products = products.Where(x => typeList.Count == 0 || typeList.Contains(x.Type.ToLower()));
        return products;
    }

}
