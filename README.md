### Superproject

FaceNet

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app superproject
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/superproject
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License

mit

### Create new site

bench new-site research
123
admin
admin

### Example

bench --site research install-app superproject

### Switch app custom

bench use research / development.localhost

bench start

### Fix DB error access denied

cd ERP_Next/.devcontainer/
docker compose up -d
