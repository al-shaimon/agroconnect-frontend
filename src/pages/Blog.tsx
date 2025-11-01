import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { COLORS } from '../constants/theme';
import { ArrowRight } from 'lucide-react';
import { blogs } from '../data/blogs';

export default function Blog() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold" style={{ color: COLORS.primary }}>
          Our Blog
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((b) => (
          <Card key={b.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0">
            <img src={b.image} alt={b.title} className="h-48 w-full object-cover" />
            <CardContent className="pt-4 px-6">
              <h3 className="text-lg font-semibold text-gray-900">{b.title}</h3>
              <p className="text-gray-600 mt-2">{b.excerpt}</p>
            </CardContent>
            <CardFooter className="justify-between px-6 pb-6">
              <div className="text-sm text-gray-500">
                {b.date} · {b.read}
              </div>
              <Link to={`/blog/${b.id}`} className="text-green-600 flex items-center gap-2">
                Read More <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
