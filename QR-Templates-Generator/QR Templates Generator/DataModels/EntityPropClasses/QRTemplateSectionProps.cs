using System.ComponentModel.DataAnnotations.Schema;
using static SimplyFairDMS.Utilities.TypeEnums;

namespace SimplyFairDMS.DataModels.EntityPropClasses
{
    public abstract class QRTemplateSectionProps
    {
        protected QRTemplateSectionProps() { }

        public void LoadFromQRTemplateSection(QRTemplateSectionProps src)
        {
            ID = src.ID;
            QRTemplateID = src.QRTemplateID;
            SectionTitle = src.SectionTitle;
            SectionDescription = src.SectionDescription;
            SectionOrder = src.SectionOrder;
            SectionType = src.SectionType;
        }

        public abstract long ID { get; set; }
        
        public long QRTemplateID { get; set; }

        public string SectionTitle { get; set; } = string.Empty;

        public string SectionDescription { get; set; } = string.Empty;

        public int SectionOrder { get; set; }

        public QRTemplateSectionType SectionType { get; set; } = QRTemplateSectionType.Form;

    }

  
}
