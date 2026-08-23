const GNEWS_API_KEY = "145bac5c8e2e06988f818a62a61cd489";
const SEARCH_QUERY   = "renewable energy";
const FALLBACK_QUERY = "sustainability";
const ARTICLE_COUNT  = 9;
const FETCH_COUNT    = 15;

$(document).ready(function () {
  loadGreenNews(SEARCH_QUERY);
});

function loadGreenNews(query) {
  const $status = $("#news-status");
  const $grid   = $("#news-grid");

  $status.text("Loading the latest green technology news...").show();
  $grid.empty();

  $.ajax({
    url: "https://api.allorigins.win/raw?url=https://gnews.io/api/v4/search",
    method: "GET",
    dataType: "json",
    data: {
      q: query,
      lang: "en",
      sortby: "publishedAt",
      max: FETCH_COUNT,
      apikey: GNEWS_API_KEY
    },
    success: function (response) {
      if (!response.articles || response.articles.length === 0) {
        if (query !== FALLBACK_QUERY) {

          loadGreenNews(FALLBACK_QUERY);
        } else {
          $status.text("No news articles found right now. Please try again later.");
        }
        return;
      }
      $status.hide();
      renderArticles(response.articles);
    },
    error: function (xhr) {
      if (GNEWS_API_KEY === "GNEWS_API_KEY") {
        $status.text(
          "⚠️ No API key set yet. Sign up for a free key at gnews.io and paste it into js/news.js."
        );
      } else if (xhr.status === 403) {
        $status.text("⚠️ API key rejected. Double-check the key pasted into js/news.js.");
      } else if (xhr.status === 429) {
        $status.text("⚠️ Daily free-tier request limit reached. Please try again tomorrow.");
      } else {
        $status.text("⚠️ Could not load news right now. Please try again later.");
      }
    }
  });
}

function renderArticles(articles) {
  const $grid = $("#news-grid");
  const uniqueArticles = removeDuplicateArticles(articles).slice(0, ARTICLE_COUNT);

  uniqueArticles.forEach(function (article) {
    const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    const imageUrl = article.image || "images/news-placeholder.jpg";

    const $card = $(`
      <article class="news-card">
        <img src="${imageUrl}" alt="${escapeHtml(article.title)}" onerror="this.src='images/news-placeholder.jpg'">
        <div class="news-card-content">
          <span class="news-source">${escapeHtml(article.source.name)} · ${publishedDate}</span>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.description || "")}</p>
          <a href="${article.url}" target="_blank" rel="noopener" class="btn btn-solid news-readmore">Read full article</a>
        </div>
      </article>
    `);

    $grid.append($card);
  });
}

/* Filter out Identical News Article */
function removeDuplicateArticles(articles) {
  const seenTitles = [];
  const unique = [];

  articles.forEach(function (article) {
    const normalized = normalizeTitle(article.title);

    const isDuplicate = seenTitles.some(function (seen) {
      return (
        seen === normalized ||
        seen.includes(normalized) ||
        normalized.includes(seen)
      );
    });

    if (!isDuplicate && normalized.length > 0) {
      seenTitles.push(normalized);
      unique.push(article);
    }
  });

  return unique;
}

function normalizeTitle(title) {
  return (title || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")   // strip punctuation
    .replace(/\s+/g, " ")      // collapse whitespace
    .trim();
}

/* Basic escaping so article text can't break the page's HTML */
function escapeHtml(str) {
  return $("<div>").text(str || "").html();
}
