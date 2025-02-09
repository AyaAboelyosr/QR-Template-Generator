using SimplyFairDMS.DataModels.EntityPropClasses;
using System.ComponentModel.DataAnnotations;
using static SimplyFairDMS.Utilities.TypeEnums;

namespace QR_Templates_Generator.DTOs
{
    public class AddSectionDTO
    {
        [Required(ErrorMessage = "Title is required.")]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters long.")]
        [MaxLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Type is required.")]
        [EnumDataType(typeof(QRTemplateSectionType), ErrorMessage = "Type must be either 'Form' or 'Table'.")]
        public QRTemplateSectionType Type { get; set; }
    }
}
