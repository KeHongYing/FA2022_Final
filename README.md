# FA2022_Final

# Build

## Environment

- Ubuntu 18.04.1
- cmake==3.10.2
- npm==8.1.2
- g++==7.5.0

## Frontend

```bash
cd front-end

# install dependency package
npm install

# run the website (default on locohost:3000)
npm start

```

## Backend

```bash
cd back-end

# clone restbed submodule
git submodule update --init --recursive

# build restbed
mkdir restbed/build
cd restbed/build
cmake -DBUILD_SSL=NO -DBUILD_TESTS=NO ..
make install

# back to root directory
cd ../../../

# compile the code
cmake -Hback-end -Bback-end/build
cmake --build back-end/build --config Release --target all

# run the server (default on localhost:8080)
./back-end/build/CalculatorAPI
```
