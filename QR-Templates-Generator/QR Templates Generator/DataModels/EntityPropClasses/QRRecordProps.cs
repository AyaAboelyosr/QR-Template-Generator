namespace SimplyFairDMS.DataModels.EntityPropClasses
{
    public abstract class QRRecordProps
    {
        public QRRecordProps()
        {
        }

        public void LoadFromQRRecordProps(QRRecordProps src)
        {
            ID = src.ID;
            QRTemplateID = src.QRTemplateID;
            CreatedBy = src.CreatedBy;
            CreatedDate = src.CreatedDate;
        }

        public abstract long ID { get; set; }

        public long QRTemplateID { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now.ToUniversalTime();
    }
}
