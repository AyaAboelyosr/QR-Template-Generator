using QR_Templates_Generator.Models;

using static SimplyFairDMS.Utilities.TypeEnums;

public class RecordPreviewDTO
{
    public long? TemplateId { get; set; }
    public long? RecordId { get; set; }
    public List<SectionPreviewDTO> Sections { get; set; } = new();
    public RecordPreviewDTO(QRRecord record)
    {
        RecordId=record.ID;
        TemplateId = record.QRTemplateID;
        if (record.QRTemplate?.QRTemplateSections != null)
        {
            foreach (var section in record.QRTemplate.QRTemplateSections.OrderBy(s => s.SectionOrder))
            {
                Sections.Add(new SectionPreviewDTO(section, record.Values));
            }
        }
    }
}

public class SectionPreviewDTO
{
    public long SectionId { get; set; }
    public string SectionTitle { get; set; }
    public bool IsTableSection { get; set; }
    public List<FieldPreviewDTO> Fields { get; set; } = new();
    public Dictionary<long, string> Values { get; set; } = new();
    public List<Dictionary<long, string>> Rows { get; set; } = new();

    public SectionPreviewDTO(QRTemplateSection section, ICollection<QRRecordSectionFieldValue> values)
    {
        SectionId= section.ID;
        SectionTitle = section.SectionTitle;
        IsTableSection = section.SectionType == QRTemplateSectionType.Table;

        // Map fields
        Fields = section.QRTemplateSectionFields?
            .OrderBy(f => f.FieldOrder)
            .Select(f => new FieldPreviewDTO(f))
            .ToList() ?? new();

        var sectionValues = values?.Where(v => v.QRTemplateSectionID == section.ID).ToList();

        if (!IsTableSection)
        {
            // Form section values
            Values = section.QRTemplateSectionFields?
                .ToDictionary(
                    f => f.ID,
                    f => sectionValues?.FirstOrDefault(v => v.QRTemplateSectionFieldID == f.ID)?.Value ?? ""
                ) ?? new();
        }
        else
        {
            // Group by RowIndex instead of QRRecordID
            var rowGroups = values?
                .Where(v => v.QRTemplateSectionID == section.ID)
                .GroupBy(v => v.RowIndex) 
                .ToList();

            Rows = rowGroups.Select(rowGroup =>
                section.QRTemplateSectionFields?
                    .ToDictionary(
                        f => f.ID,
                        f => rowGroup.FirstOrDefault(v => v.QRTemplateSectionFieldID == f.ID)?.Value ?? ""
                    ) ?? new Dictionary<long, string>()
            ).ToList();
        }
    }
}
