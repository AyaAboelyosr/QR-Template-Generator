namespace SimplyFairDMS.DataModels.EntityPropClasses
{
    public abstract class QRRecordSectionFieldValueProps
    {
        public QRRecordSectionFieldValueProps()
        {
        }

        public void LoadFromQRRecordSectionFieldValueProps(QRRecordSectionFieldValueProps src)
        {
            ID = src.ID;
            QRRecordID = src.QRRecordID;
            QRTemplateSectionFieldID = src.QRTemplateSectionFieldID;
            QRTemplateSectionID = src.QRTemplateSectionID;
            Value = src.Value;
        }

        public abstract long ID { get; set; }

        public long QRRecordID { get; set; }

        public long? QRTemplateSectionFieldID { get; set; }

        public long QRTemplateSectionID { get; set; }
        
        public string Value { get; set; }
    }
}
