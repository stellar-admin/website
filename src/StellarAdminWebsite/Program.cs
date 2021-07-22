using System.Threading.Tasks;
using Statiq.App;
using Statiq.Common;
using Statiq.Web;
using StellarAdminWebsite.Modules;
using StellarAdminWebsite.Shortcodes;

namespace StellarAdminWebsite
{
    class Program
    {
        public static async Task<int> Main(string[] args) =>
            await Bootstrapper.Factory
                .CreateWeb(args)
                .ModifyPipeline("Content",
                    pipeline =>
                    {
                        pipeline.WithProcessModules(new ExtractDocsOrderFromPath());
                    })
                .ModifyPipeline("Assets",
                    pipeline =>
                    {
                        pipeline.WithProcessModules(new AdjustAssetsPath());
                    })
                .AddShortcode<InThisSectionShortcode>("InThisSection")
                .RunAsync();
    }
}
