using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent( IsOptional = true )]
[Package<ZorroPackage>]
[TypeScriptFile( "filter-model.ts", "FilterType", "Filter", "SwitchFilter", "SelectFilter" )]
public sealed class FiltersComponent : NgComponent
{
}
