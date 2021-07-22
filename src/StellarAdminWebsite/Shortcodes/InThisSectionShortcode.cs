using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using Statiq.Common;

namespace StellarAdminWebsite.Shortcodes
{
    public class InThisSectionShortcode: SyncShortcode
    {
        public override ShortcodeResult Execute(KeyValuePair<string, string>[] args, string content, IDocument document, IExecutionContext context)
        {
            var rootList = GetChildren(document, context);

            return rootList!.ToString();
        }

        private static XElement? GetChildren(IDocument document, IExecutionContext context)
        {
            var children = context.OutputPages.GetChildrenOf(document).OrderBy(d => d.GetInt("Order"));
            var rootList = new XElement("ul");
            foreach (var child in children)
            {
                var li = new XElement("li");
                rootList.Add(li);

                var a = new XElement("a",
                    child.GetTitle(),
                    new[]
                    {
                        new XAttribute("href", context.GetLink(child))
                    });
                li.Add(a);

                if (context.OutputPages.GetChildrenOf(child).Any())
                {
                    li.Add(GetChildren(child, context));
                }
            }

            return rootList;
        }
    }
}