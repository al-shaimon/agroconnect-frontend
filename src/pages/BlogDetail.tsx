import { useParams, Link } from 'react-router-dom';
import { COLORS } from '../constants/theme';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogs } from '../data/blogs';
import { Button } from '../components/ui/button';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
        <Link to="/blog">
          <Button className="mt-4" style={{ backgroundColor: COLORS.primary }}>
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link to="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold" style={{ color: COLORS.primary }}>
        {blog.title}
      </h1>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{blog.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{blog.read}</span>
        </div>
      </div>

      {/* Featured image */}
      <div className="rounded-xl overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover" />
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {blog.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
