using System.Collections.Generic;
using System.Text.RegularExpressions;
using Statiq.Common;

namespace StellarAdminWebsite.Modules
{
    public class AdjustAssetsPath : SyncModule
    {
        protected override IEnumerable<IDocument> ExecuteInput(IDocument input, IExecutionContext context)
        {
            var cleanedPath = StripOrderFromPath(input.Destination);

            return context.CloneOrCreateDocument(input, cleanedPath)
                .Yield();
        }

        private static NormalizedPath StripOrderFromPath(NormalizedPath input)
        {
            var regex = new Regex(@"\d+-");

            return new NormalizedPath(regex.Replace(input.FullPath, ""));
        }

    }
}