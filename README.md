# payment_api

build image:

```bash
docker build -t <IMAGE NAME> .
```

run container:

```bash
docker run --env-file ./.env.dev -p 5000:5000 <IMAGE NAME>
```
