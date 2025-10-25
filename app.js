const { ApolloServer, gql } = require('apollo-server');


const tracks = [
  { id: 'track_001', title: 'Ocean Eyes', duration: 201, album: 'Don’t Smile at Me', dateAdded: '2023-10-01T12:34:56Z' },
  { id: 'track_002', title: 'Sunset Lover', duration: 180, album: 'Sunset Lover EP', dateAdded: '2023-10-02T08:22:10Z' },
  { id: 'track_003', title: 'Night Owl', duration: 215, album: 'Late Nights', dateAdded: '2023-10-03T16:45:30Z' },
  { id: 'track_004', title: 'Morning Light', duration: 200, album: 'Sunrise', dateAdded: '2023-10-04T09:15:00Z' }
];

let playlists = [
  {
    id: '123',
    name: 'Chill Vibes',
    description: 'Relaxing tunes to unwind',
    owner: 'user_456',
    tracks: ['track_001', 'track_002', 'track_003']
  }
];

// GraphQL schema

const typeDefs = gql`
  type Track {
    id: ID!
    title: String!
    duration: Int!
    album: String
    dateAdded: String!
  }

  type Playlist {
    id: ID!
    name: String!
    description: String
    owner: ID!
    tracks: [Track!]!
  }

  type Query {
    playlists: [Playlist!]!
    playlist(id: ID!): Playlist
    tracks: [Track!]!
  }

  type Mutation {
    addTrackToPlaylist(playlistId: ID!, trackId: ID!): Playlist!
    removeTrackFromPlaylist(playlistId: ID!, trackId: ID!): Playlist!
    addPlaylist(name: String!, description: String, owner: ID!): Playlist!
  }
`;


const resolvers = {
  Query: {
    playlists: () => playlists,
    playlist: (_, { id }) => playlists.find(p => p.id === id),
    tracks: () => tracks
  },
  Playlist: {
    tracks: (playlist) => playlist.tracks.map(trackId => tracks.find(t => t.id === trackId))
  },
  Mutation: {
    addTrackToPlaylist: (_, { playlistId, trackId }) => {
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) throw new Error('Playlist not found');

      const track = tracks.find(t => t.id === trackId);
      if (!track) throw new Error('Track does not exist');

      if (!playlist.tracks.includes(trackId)) {
        playlist.tracks.push(trackId);
      }

      return playlist;
    },
    removeTrackFromPlaylist: (_, { playlistId, trackId }) => {
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) throw new Error('Playlist not found');

      playlist.tracks = playlist.tracks.filter(id => id !== trackId);
      return playlist;
    },
    addPlaylist: (_, { name, description, owner }) => {
      const newPlaylist = {
        id: `${Date.now()}`,
        name,
        description,
        owner,
        tracks: []
      };
      playlists.push(newPlaylist);
      return newPlaylist;
    }
  }
};


const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  path: '/graphql' 
});


server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
