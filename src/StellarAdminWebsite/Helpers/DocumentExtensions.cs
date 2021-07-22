using Statiq.Common;
using System.Linq;

namespace StellarAdminWebsite.Helpers
{
    public static class DocumentExtensions
    {
        public static IDocument? GetSectionRoot(this IDocument document, IDocument docsRoot, FilteredDocumentList<IDocument> outputPages)
        {
            var sectionRootDocuments = outputPages.GetChildrenOf(docsRoot);
            var currentDocument = document;
            while (currentDocument != null && !sectionRootDocuments.Contains(currentDocument))
            {
                currentDocument = outputPages.GetParentOf(currentDocument);
            }
            return currentDocument;
        }
    }
}