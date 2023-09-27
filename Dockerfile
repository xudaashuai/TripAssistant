FROM denoland/deno:1.10.3

# The port that your application listens to.
EXPOSE 80

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
ADD . .

CMD ["run", "--allow-net", "main.ts"]
