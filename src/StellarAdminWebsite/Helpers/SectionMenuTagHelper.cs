using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Statiq.Common;

namespace StellarAdminWebsite.Helpers
{
    [HtmlTargetElement("section-menu")]
    public class SectionMenuTagHelper : TagHelper
    {
        public IExecutionContext? Context { get; set; }

        public IDocument? Document { get; set; }

        public FilteredDocumentList<IDocument>? Pages { get; set; }

        public IDocument? Section { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if (Section == null || Pages == null || Context == null || Document == null) return;

            var children = Pages.GetChildrenOf(Section).OrderBy(d => d.GetInt("Order")).ToList();
            if (children.Any())
            {
                var ul = GenerateItems(children, false);

                output.PreContent.SetHtmlContent(ul);
            }

            output.TagName = "nav";
            output.TagMode = TagMode.StartTagAndEndTag;
        }

        private IHtmlContent GenerateItems(List<IDocument> items, bool indent = true)
        {
            var ul = new TagBuilder("ul");
            if (indent) ul.Attributes["class"] = "ml-5";

            foreach (var child in items)
            {
                var isStaticHeader = child.GetBool("isStaticHeader");
                var li2 = isStaticHeader switch
                {
                    true => GenerateStaticItem(child),
                    false => GenerateTreeItem(child)
                };
                ul.InnerHtml.AppendHtml(li2);

                var children = Pages!.GetChildrenOf(child).OrderBy(d => d.GetInt("Order")).ToList();
                if (children.Any()) li2.InnerHtml.AppendHtml(GenerateItems(children, !isStaticHeader));
            }

            return ul;
        }

        private TagBuilder GenerateStaticItem(IDocument document)
        {
            var li = new TagBuilder("li");
            li.Attributes["class"] = "mb-5";

            var span = new TagBuilder("span");
            li.InnerHtml.AppendHtml(span);
            span.Attributes["class"] = "px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate";
            span.InnerHtml.Append(document.GetString("navTitle") ?? document.GetTitle());

            return li;
        }

        private TagBuilder GenerateTreeItem(IDocument document)
        {
            var isActive = document == Document;
            var classNames =
                "group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md hover:text-gray-900 focus:outline-none transition ease-in-out duration-150" +
                (isActive ? " bg-gray-100 hover:bg-gray-100 focus:bg-gray-200" : " hover:bg-gray-50 focus:bg-gray-100");

            var li = new TagBuilder("li");

            var a = new TagBuilder("a");
            a.Attributes["class"] = classNames;
            li.InnerHtml.AppendHtml(a);
            a.Attributes["href"] = Context.GetLink(document);

            var span = new TagBuilder("span");
            a.InnerHtml.AppendHtml(span);
            span.Attributes["class"] = "truncate";
            span.InnerHtml.Append(document.GetString("navTitle") ?? document.GetTitle());

            return li;
        }
    }
}