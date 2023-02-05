
# Run meilisearch
docker run -it --rm -p 7700:7700 -e MEILI_MASTER_KEY='MASTER_KEY' -v ./meili_data:/meili_data getmeili/meilisearch:v0.30 meilisearch --env="development"
