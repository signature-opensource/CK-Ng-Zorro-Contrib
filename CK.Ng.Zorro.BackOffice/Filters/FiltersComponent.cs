using CK.Core;
using CK.TS.Angular;
using CK.TypeScript;

namespace CK.Ng.Zorro;

[NgComponent]
[Package<BackOfficePackage>]
[TypeScriptFile( "filter.model.ts", "FilterType", "Filter", "SwitchFilter", "SelectFilter" )]
public sealed class FiltersComponent : NgComponent
{
}
