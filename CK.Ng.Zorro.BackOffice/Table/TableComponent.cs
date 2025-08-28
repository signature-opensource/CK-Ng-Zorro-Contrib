using CK.Core;
using CK.Ng.Zorro.BackOffice;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "table-action-model.ts", "TableAction" )]
[TypeScriptFile( "table-column-model.ts", "TableCellStyle", "TableCellContext", "TableColumn", "CKTableColumn", "ColumnFilter" )]
public sealed class TableComponent : NgComponent
{
}
