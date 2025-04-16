const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";

async function insertSampleData() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("animeTracker");
        
        await db.collection('anime').insertMany([
            {
                id: 1,
                title: "Attack on Titan",
                image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
                episodes: 75,
                genre: "action",
                year: 2013,
                description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans.",
                streamingLinks: [
                    { platform: "Crunchyroll", url: "https://www.crunchyroll.com/attack-on-titan" },
                    { platform: "Hulu", url: "https://www.hulu.com/series/attack-on-titan" }
                ],
                progress: 0
            },
            {
                id: 2,
                title: "Death Note",
                image: "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
                episodes: 37,
                genre: "drama",
                year: 2006,
                description: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing the victim's name.",
                streamingLinks: [
                    { platform: "Netflix", url: "https://www.netflix.com/title/70204970" }
                ],
                progress: 0
            },
            {
                id: 3,
                title: "Demon Slayer",
                image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
                episodes: 26,
                genre: "action",
                year: 2019,
                description: "After a demon attack leaves his family slain and his sister cursed, Tanjiro embarks upon a perilous journey.",
                streamingLinks: [
                    { platform: "Crunchyroll", url: "https://www.crunchyroll.com/demon-slayer" }
                ],
                progress: 0
            }
        ]);
        
        console.log("✅ Sample data inserted successfully");
    } catch (err) {
        console.error("❌ Error inserting data:", err);
    } finally {
        await client.close();
    }
}

insertSampleData();