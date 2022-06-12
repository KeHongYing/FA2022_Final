# FA2022_Final

# Build

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

# run
./back-end/build/CalculatorAPI
```
