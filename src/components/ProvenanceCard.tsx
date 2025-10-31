import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tender } from "@/types/tender";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface ProvenanceCardProps {
  tender: Tender;
}

export function ProvenanceCard({ tender }: ProvenanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const provenance = tender.provenance;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(tender, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Data Provenance</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Expand
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fetched:</span>
            <span className="font-medium">{formatDate(provenance.fetched_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Normalized:</span>
            <span className="font-medium">{formatDate(provenance.normalized_at)}</span>
          </div>
          {provenance.raw_hash && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hash:</span>
              <code className="font-mono text-xs">{provenance.raw_hash}</code>
            </div>
          )}
          {provenance.source_url && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source URL:</span>
              <a
                href={provenance.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-xs truncate max-w-xs"
              >
                {provenance.source_url}
              </a>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Raw JSON</span>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
              {JSON.stringify(tender, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
