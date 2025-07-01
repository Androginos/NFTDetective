const WebSocket = require('ws');
const { createPublicClient, http } = require('viem');
const { mainnet } = require('viem/chains');

// Simple WebSocket server for NFT Detective testing
const PORT = 3001;

// ERC721 ABI basics
const erc721Abi = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf", 
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Blockchain client
const client = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com')
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`
🔍 NFT Detective Simple Backend
📡 WebSocket Server: ws://localhost:${PORT}
🚀 Ready for frontend connection!
`);

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to NFT Detective backend',
    timestamp: Date.now()
  }));

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Received:', data.type);

      switch (data.type) {
        case 'watch_contract':
          await handleWatchContract(ws, data.data);
          break;
          
        case 'get_token_info':
          await handleGetTokenInfo(ws, data.data);
          break;
          
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
          
        default:
          console.log('❓ Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        error: error.message
      }));
    }
  });

  ws.on('close', () => {
    console.log('👋 Client disconnected');
  });
});

// Handle contract watching
async function handleWatchContract(ws, data) {
  try {
    const { contractAddress } = data;
    console.log(`👀 Watching contract: ${contractAddress}`);
    
    // Get basic contract info
    const contractName = await client.readContract({
      address: contractAddress,
      abi: erc721Abi,
      functionName: 'name'
    }).catch(() => 'Unknown Contract');

    ws.send(JSON.stringify({
      type: 'contract_info',
      data: {
        contractAddress,
        name: contractName,
        status: 'watching'
      }
    }));

    // Simulate getting some sample tokens (1, 2, 3)
    for (let tokenId = 1; tokenId <= 3; tokenId++) {
      try {
        const [owner, tokenURI] = await Promise.allSettled([
          client.readContract({
            address: contractAddress,
            abi: erc721Abi,
            functionName: 'ownerOf',
            args: [BigInt(tokenId)]
          }),
          client.readContract({
            address: contractAddress,
            abi: erc721Abi,
            functionName: 'tokenURI',
            args: [BigInt(tokenId)]
          })
        ]);

        if (owner.status === 'fulfilled' && tokenURI.status === 'fulfilled') {
          // Fetch metadata
          const metadata = await fetchMetadata(tokenURI.value);

          ws.send(JSON.stringify({
            type: 'token_data',
            data: {
              contractAddress,
              tokenId: tokenId.toString(),
              owner: owner.value,
              tokenURI: tokenURI.value,
              metadata
            }
          }));
        }
      } catch (error) {
        console.log(`⚠️ Token ${tokenId} error:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Watch contract error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to watch contract',
      error: error.message
    }));
  }
}

// Handle single token info request
async function handleGetTokenInfo(ws, data) {
  try {
    const { contractAddress, tokenId } = data;
    
    const [owner, tokenURI] = await Promise.all([
      client.readContract({
        address: contractAddress,
        abi: erc721Abi,
        functionName: 'ownerOf',
        args: [BigInt(tokenId)]
      }),
      client.readContract({
        address: contractAddress,
        abi: erc721Abi,
        functionName: 'tokenURI',
        args: [BigInt(tokenId)]
      })
    ]);

    const metadata = await fetchMetadata(tokenURI);

    ws.send(JSON.stringify({
      type: 'token_info',
      data: {
        contractAddress,
        tokenId,
        owner,
        tokenURI,
        metadata
      }
    }));

  } catch (error) {
    console.error('❌ Get token info error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Failed to get token info',
      error: error.message
    }));
  }
}

// Fetch metadata from IPFS/HTTP
async function fetchMetadata(uri) {
  try {
    if (!uri) return null;
    
    let fetchUrl = uri;
    if (uri.startsWith('ipfs://')) {
      fetchUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(fetchUrl, { timeout: 5000 });
    
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('⚠️ Metadata fetch error:', error.message);
    return null;
  }
}

console.log('✅ Backend server started successfully!'); 