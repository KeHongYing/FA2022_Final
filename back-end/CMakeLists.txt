cmake_minimum_required(VERSION 3.0)

project(CalculatorAPI)

add_executable(CalculatorAPI 
    main.cpp 
    CalcResourceFactory.cpp
    CalcService.cpp
    CalcServiceSettingsFactory.cpp)
# target_link_libraries(CalculatorAPI restbed)
target_link_libraries(CalculatorAPI ${CMAKE_SOURCE_DIR}/restbed/distribution/library/librestbed.a pthread)
target_include_directories(CalculatorAPI PUBLIC ${CMAKE_SOURCE_DIR}/include)
target_include_directories(CalculatorAPI PUBLIC ${CMAKE_SOURCE_DIR}/restbed/distribution/include)
set_property(TARGET CalculatorAPI PROPERTY CXX_STANDARD 17)