using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Statiq.Common;

namespace StellarAdminWebsite.Modules
{
    public class ExtractDocsOrderFromPath: SyncModule
    {
        protected override IEnumerable<IDocument>? ExecuteInput(IDocument input, IExecutionContext context)
        {
            var cleanedPath = StripOrderFromPath(input.Destination);
            var cleanedTitle = StripOrderFromTitle(input.GetTitle());
            var order = ExtractOrderFromPath(input.Destination);

            var items = new List<KeyValuePair<string, object>>
            {
                new KeyValuePair<string, object>(Keys.Title, cleanedTitle)
            };

            if (order.HasValue)
            {
                items.Add(new KeyValuePair<string, object>("order", order.Value));
            }

            return context.CloneOrCreateDocument(input, cleanedPath, items)
                .Yield();
        }

        private static int? ExtractOrderFromPath(NormalizedPath path)
        {
            if (string.IsNullOrEmpty(path.FileName.FullPath))
            {
                return null;
            }

            if (string.Equals(path.FileNameWithoutExtension.FullPath, "index", StringComparison.OrdinalIgnoreCase))
            {
                // If we have an index.* file, look for the order in the previous path segment
                if (path.Segments.Length > 1)
                {
                    var precedingSegment = path.Segments.Reverse().Skip(1).Take(1).First();
                    return ExtractOrderFromPathSegment(precedingSegment.ToString());
                }
                return null;
            }

            return ExtractOrderFromPathSegment(path.FileName.FullPath);
        }

        private static int? ExtractOrderFromPathSegment(string segment)
        {
            var regex = new Regex(@"^(?<order>\d+)-.+$");
            var match = regex.Match(segment);
            if (match.Success)
            {
                return Convert.ToInt32(match.Groups["order"].Value);
            }

            return null;
        }

        private static NormalizedPath StripOrderFromPath(NormalizedPath input)
        {
            var regex = new Regex(@"\d+-");

            return new NormalizedPath(regex.Replace(input.FullPath, ""));
        }

        private static string StripOrderFromTitle(string title)
        {
            var regex = new Regex(@"\d+\ ");

            return regex.Replace(title, "");
        }
    }
}