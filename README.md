# Tokendesk
Smart Contracts for Tokendesk.io

## Testing

To run tests you have to run `ganache-cli` with additional parameters, because tests require wallets with lots of ether to test edge cases. By default `ganache-cli` gives 100 ether for generated accounts:

    ganache-cli --account="0x7a44e8791fdba705b42b5fd335215757714a3e7c60b9cc867f1318ac601c6f39,1000000000000000000000000000" --account="0x841803f6fb3e68a707e9dc3d592096e7d90531a9d38a8c57fbd166fdf98793d5,1000000000000000000000000000" --account="0xb73d0ec8fa9f45e0a3bc96eb1b95676725afc51ba0ba4f319e7a9a0c549bc365,1000000000000000000000000000"

And then in another console run tests

    $ truffle test
