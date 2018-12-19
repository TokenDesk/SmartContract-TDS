module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
      test: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*", // Match any network id
        gas: 671309400
      },
      development: {
        host: "127.0.0.1",
        port: 8545,
        network_id: "*",
        gas: 6713094
      },
      live: {
        host: "127.0.0.1",  // Change into main net node address
        port: 8545,
        network_id: "1",
        gas: 6713094,
        gasPrice: 9000000000,
        from: ""
      }
  }
};
