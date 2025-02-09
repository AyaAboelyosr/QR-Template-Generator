using QR_Templates_Generator.Models;
using SimplyFairDMS.DataModels.EntityPropClasses;

public class FieldPreviewDTO
{
    public long Id { get; set; }
    public string FieldTitle { get; set; }
    public FieldPreviewDTO(QRTemplateSectionField field)
    {
        Id = field.ID;
        FieldTitle = field.FieldTitle;
    }
}
