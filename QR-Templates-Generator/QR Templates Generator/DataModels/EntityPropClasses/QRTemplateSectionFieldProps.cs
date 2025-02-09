using static SimplyFairDMS.Utilities.TypeEnums;

namespace SimplyFairDMS.DataModels.EntityPropClasses
{
    public abstract class QRTemplateSectionFieldProps
    {
        public QRTemplateSectionFieldProps()
        {
        }

        public void LoadFromTemplateSectionFieldProps(QRTemplateSectionFieldProps src)
        {
            ID = src.ID;
            QRTemplateSectionID = src.QRTemplateSectionID;
            FieldTitle = src.FieldTitle;
            FieldDescription = src.FieldDescription;
            FieldOrder = src.FieldOrder;
            FieldType = src.FieldType;
        }

        public abstract long ID { get; set; }

        public long QRTemplateSectionID { get; set; }

        public string FieldTitle { get; set; } = string.Empty;

        public string FieldDescription { get; set; } = string.Empty;

        public int FieldOrder { get; set; }

        public QRTemplateSectionFieldType FieldType { get; set; }
    }

   
}
