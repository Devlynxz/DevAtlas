import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryBySlug } from "../api/categories";
import ArticlesPage from "./ArticlesPage";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/ui/ErrorState";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    getCategoryBySlug(slug)
      .then((response) => active && setCategory(response.data.result))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <Spinner />;

  if (notFound || !category) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24">
        <ErrorState message="This category could not be found." />
      </div>
    );
  }

  return <ArticlesPage fixedCategory={slug} title={category.name} description={category.description} />;
}
