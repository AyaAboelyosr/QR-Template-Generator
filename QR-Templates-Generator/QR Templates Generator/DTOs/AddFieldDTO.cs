using SimplyFairDMS.DataModels.EntityPropClasses;
using System.ComponentModel.DataAnnotations;
using static SimplyFairDMS.Utilities.TypeEnums;

namespace QR_Templates_Generator.DTOs
{
    public class AddFieldDTO
    {
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Type is required.")]
        [EnumDataType(typeof(QRTemplateSectionFieldType), ErrorMessage = "Type must be one of the defined field types.")]
        public QRTemplateSectionFieldType Type { get; set; }

        public bool IsRequired { get; set; }
    }
}
