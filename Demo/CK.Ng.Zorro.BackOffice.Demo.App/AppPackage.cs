using CK.Core;
using CK.TypeScript;

namespace CK.Ng.Zorro.BackOffice.Demo.App;

[TypeScriptPackage]
[Requires<BackOfficePackage>]
[Requires<BlockquoteComponent>]
[Requires<GenericFormComponent>]
[Requires<LoaderComponent>]
[Requires<TableComponent>]
[Requires<FiltersComponent>]
public sealed class AppPackage : TypeScriptPackage
{
}
