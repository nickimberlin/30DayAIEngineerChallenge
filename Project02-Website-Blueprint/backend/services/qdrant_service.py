from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Optional
import uuid

class QdrantService:
    def __init__(self, collection_name: str = "blueprints"):
        self.collection_name = collection_name
        self.client: Optional[QdrantClient] = None
        self._initialized = False
    
    async def initialize(self, vector_size: int = 384):
        if not self._initialized:
            try:
                self.client = QdrantClient(path="./qdrant_data")
            except Exception:
                self.client = QdrantClient(host="localhost", port=6333)
            
            collections = self.client.get_collections().collections
            collection_names = [c.name for c in collections]
            
            if self.collection_name not in collection_names:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
                )
            
            self._initialized = True
    
    async def add_blueprint(self, blueprint_id: str, description: str, embedding: List[float]):
        if not self._initialized:
            raise RuntimeError("Qdrant not initialized. Call initialize() first.")
        
        point = PointStruct(
            id=blueprint_id,
            vector=embedding,
            payload={"description": description}
        )
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=[point]
        )
    
    async def search_similar(self, query_embedding: List[float], limit: int = 5) -> List[str]:
        if not self._initialized:
            raise RuntimeError("Qdrant not initialized. Call initialize() first.")
        
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit
        )
        
        return [result.id for result in results]

qdrant_service = QdrantService()

async def get_qdrant_service() -> QdrantService:
    await qdrant_service.initialize()
    return qdrant_service