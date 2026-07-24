import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Modal } from './Modal';
import { Newspaper, ChevronRight, Calendar, User } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  category: string;
  date: string;
  author: string;
  snippet: string;
  content: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: 'SmartCorp Secures ISO 27001 Information Security Certification',
    category: 'Corporate Standard',
    date: 'July 20, 2026',
    author: 'Compliance Office',
    snippet: 'Official confirmation of enterprise security compliance following exhaustive third-party auditor verification.',
    content: 'SmartCorp is proud to announce formal accreditation for ISO/IEC 27001:2022 ISMS standards across all global engineering hubs. This milestone validates our zero-trust infrastructure, data protection policies, and secure employee data management practices.'
  },
  {
    id: 2,
    title: 'Q3 Enterprise Software Townhall & Product Strategy Preview',
    category: 'Townhall',
    date: 'July 18, 2026',
    author: 'Executive Team',
    snippet: 'Key leadership takeaways on cloud product roadmap and upcoming employee benefit enhancements.',
    content: 'Join Executive VP of Operations this Friday at 10:00 AM EST for our all-hands strategy briefing. Topics include AI workflow integration, remote stipend adjustments, and Q3 project portfolio targets.'
  }
];

export const CompanyNewsWidget: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  return (
    <>
      <Card>
        <CardHeader
          action={
            <Badge variant="blue" size="sm">Newsfeed</Badge>
          }
        >
          <span className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Newspaper className="w-4 h-4 text-blue-600" /> Company News & Updates
          </span>
        </CardHeader>
        <CardBody className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {NEWS_ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-4 hover:bg-blue-50/40 dark:hover:bg-slate-800/40 cursor-pointer transition-colors duration-150 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant="gray" size="sm">{article.category}</Badge>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">{article.date}</span>
              </div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-snug hover:text-indigo-600 transition-colors">
                {article.title}
              </h5>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {article.snippet}
              </p>
            </div>
          ))}
        </CardBody>
      </Card>

      {selectedArticle && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.title}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3 font-medium">
              <Badge variant="blue">{selectedArticle.category}</Badge>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedArticle.date}</span>
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedArticle.author}</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              {selectedArticle.content}
            </p>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedArticle(null)}>Close Article</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
