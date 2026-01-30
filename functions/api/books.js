const books = [
  { cn_title: "创巴仁波切文集第1卷（第一部）", en_title: "The Collected Works of Chögyam Trungpa, Volume 1 (Part One)" },
  { cn_title: "创巴仁波切文集第2卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 2" },
  { cn_title: "创巴仁波切文集第3卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 3" },
  { cn_title: "创巴仁波切文集第4卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 4" },
  { cn_title: "创巴仁波切文集第5卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 5" },
  { cn_title: "创巴仁波切文集第6卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 6" },
  { cn_title: "创巴仁波切文集第7卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 7" },
  { cn_title: "创巴仁波切文集第8卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 8" },
  { cn_title: "创巴仁波切文集第9卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 9" },
  { cn_title: "创巴仁波切文集第10卷", en_title: "The Collected Works of Chögyam Trungpa, Volume 10" }
];

// 获取文集目录
export async function onRequest(context) {
  try {
    return new Response(JSON.stringify(books), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error) {
    console.error('Error loading book list:', error);
    return new Response(JSON.stringify({ error: 'Failed to load book list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
