using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "models/table-action.model.ts", "TableAction" )]
[TypeScriptFile( "models/table-column.model.ts", "TableCellStyle", "TableCellContext", "TableColumn", "CKTableColumn", "ColumnFilter" )]
public sealed class TableComponent : NgComponent
{
}
