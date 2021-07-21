using Statiq.Common;
using StellarAdminWebsite.Helpers;
using Xunit;

namespace StellarAdminWebsite.Test.Helpers
{
    public class DocumentOrderExtractorTests
    {
        [Theory]
        [InlineData("docs/100-introduction/index.cshtml", "docs/introduction/index.cshtml", 100)]
        [InlineData("docs/100-introduction/10-getting-started/index.cshtml", "docs/introduction/getting-started/index.cshtml", 10)]
        [InlineData("docs/100-introduction/10-getting-started.cshtml", "docs/introduction/getting-started.cshtml", 10)]
        [InlineData("docs/index.cshtml", "docs/index.cshtml", null)]
        [InlineData("docs/100-introduction/getting-started/index.cshtml", "docs/introduction/getting-started/index.cshtml", null)]
        [InlineData("index.cshtml", "index.cshtml", null)]
        [InlineData("features/index.cshtml", "features/index.cshtml", null)]
        public void Extracts_path_and_order_correctly(string inputPath, string outputPath, int? order)
        {
            // Arrange
            var normalizedPath = new NormalizedPath(inputPath);
            
            // Act
            var pathWithOrder = DocumentOrderExtractor.Extract(normalizedPath);
            
            // Assert
            Assert.Equal(outputPath, pathWithOrder!.Path.FullPath);
            Assert.Equal(order, pathWithOrder.Order);
        }
    }
}