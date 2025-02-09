using AutoMapper;
using QR_Templates_Generator.DTOs;
using QR_Templates_Generator.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<QRTemplate, QRTemplateeDTO>();
        CreateMap<AddQRTemplateDTO, QRTemplate>();
        CreateMap<UpdateQRTemplateDTO, QRTemplate>();

        CreateMap<AddSectionDTO, QRTemplateSection>()
            .ForMember(dest => dest.SectionTitle, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.SectionType, opt => opt.MapFrom(src => src.Type));

        CreateMap<UpdateSectionDTO, QRTemplateSection>()
            .ForMember(dest => dest.SectionTitle, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.SectionType, opt => opt.MapFrom(src => src.Type));

        CreateMap<AddFieldDTO, QRTemplateSectionField>()
            .ForMember(dest => dest.FieldTitle, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.FieldType, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.IsRequired, opt => opt.MapFrom(src => src.IsRequired));

        CreateMap<UpdateFieldDTO, QRTemplateSectionField>()
            .ForMember(dest => dest.FieldTitle, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.FieldType, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.IsRequired, opt => opt.MapFrom(src => src.IsRequired));

        CreateMap<QRTemplate, ResponseQRTemplateDTO>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title));

        CreateMap<QRTemplate, QRTemplateDTO>()
            .ForMember(dest => dest.Sections, opt => opt.MapFrom(src => src.QRTemplateSections));

        CreateMap<QRTemplateSection, QRTemplateSectionDTO>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.SectionTitle))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.SectionType))
            .ForMember(dest => dest.Fields, opt => opt.MapFrom(src => src.QRTemplateSectionFields));

        CreateMap<QRTemplateSectionField, QRTemplateSectionFieldDTO>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.FieldTitle))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.FieldType))
            .ForMember(dest => dest.IsRequired, opt => opt.MapFrom(src => src.IsRequired));

        CreateMap<QRTemplateSection, ResponseSectionDTO>()
            .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.ID))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.SectionTitle))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.SectionType.ToString()));

        CreateMap<QRTemplateSectionField, ResponseFieldDTO>()
      .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.ID))
      .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.FieldTitle))
      .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.FieldType.ToString())) // Convert enum to string
      .ForMember(dest => dest.IsRequired, opt => opt.MapFrom(src => src.IsRequired));
    }
}