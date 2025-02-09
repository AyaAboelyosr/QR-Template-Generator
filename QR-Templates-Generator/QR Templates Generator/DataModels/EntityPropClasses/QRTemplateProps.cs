namespace SimplyFairDMS.DataModels.EntityPropClasses
{
    public abstract class QRTemplateProps
    {
        public QRTemplateProps()
        {
        }


        public virtual void LoadFromQRTemplate(QRTemplateProps template)
        {
            ID = template.ID;
            Title = template.Title;
            Description = template.Description;
            UniqeCode = template.UniqeCode;
        }

        public abstract long ID { get; set; }
        public string UniqeCode { get; set; }

        public string Title { get; set; } = string.Empty;

        public virtual string Description { get; set; }
    }
}
