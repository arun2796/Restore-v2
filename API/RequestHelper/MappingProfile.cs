using System;
using API.DTO;
using API.Model;
using AutoMapper;

namespace API.RequestHelper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
    }
}
