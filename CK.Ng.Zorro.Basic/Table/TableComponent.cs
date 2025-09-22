using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[TypeScriptFile( "table-action-model.ts", "TableAction" )]
[TypeScriptFile( "table-column-model.ts", "TableCellStyle", "TableCellContext", "TableColumn", "DefaultTableColumn", "ColumnFilter" )]
public sealed class TableComponent : NgComponent
{
}
