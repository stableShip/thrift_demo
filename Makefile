THRIFTS = $(shell find thriftProtocol -type f -name "*.thrift")

thrift-gen:
	@echo "开始thrift文件编译, 编译文件: "
	@echo $(THRIFTS)
	@rm -rf thriftMessage/*.js
	@for thriftFile in $(THRIFTS); \
	do \
		thrift \
		-gen js:node \
		-out thriftMessage \
		$$thriftFile; \
		echo "编译" $$thriftFile "完毕"; \
	done


.PHONY: thrift-gen