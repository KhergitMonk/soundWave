const settings = {
    LastFMApiRootAddr: 'https://ws.audioscrobbler.com/2.0/?method=',
    LastFMAPIKey: '9e74d28c89b4068472bf95037e41ff01',
    YTSearchKey: 'AIzaSyDSAJLzRooDXEfmOzx-9diXtA0hUV_-DSk',
    APISeedsLyricsKey: 'UxyxRc0c61QGA0t9ULzIKLM23BG6b62A8Lvq6Qu2Zdh6vXlOY1XTgNyPoKZNtyWG',
    NodeServerRootAddr: process.env.NODE_SERVER_URL ? process.env.NODE_SERVER_URL : 'http://localhost:3000'
}

export default settings;