require_relative "ui"

class Situation
    attr_accessor :id, :title

    def initialize id, fname
        @id = id
        @title = ""

        # Set up the description file
        @desc_fname = fname
        create_desc_file
    end

    def create_desc_file
        if File.exist? @desc_fname
            return
        end
        
        puts "Creating file #{@desc_fname}"
        begin
            File.open(@desc_fname, "w") do |f|
                f.puts "# Write the description for situation #{id} here:"
                f.puts "# Comments start with '#'"
                f.puts "# You can use HTML tags in this file"
            end
        rescue Exception => e
            puts "Could not open #{@desc_fname}: #{e.message}"
        end
    end
    
    def delete_desc_file
        delete_file = prompt_approval "Delete file #{@desc_fname}?"
        if delete_file
            begin
                FileUtils.rm_f(@desc_fname)
            rescue Exception => e
                puts "Error deleting #{@desc_fname}: #{e.message}"
            end
        end
    end

    # Convert to a hash for JSON
    def to_hash
        {
            "title" => @title,
            "desc" => desc.join(" ")
        }
    end

    def to_s
        output =  "====================================\n"
        output += "#{@id}: #{@title}\n"
        output += "====================================\n\n"
        output += desc.join("\n") + "\n"
        output
    end

    def edit
        @title = prompt_edit_str "Situation Title:", @title
        puts "To edit the description, edit the file #{@desc_fname}"
    end

    # Read the description from the file
    def desc
        begin
            File.readlines(@desc_fname)
                .reject{|line| line =~ /^#/ }
                .map{|line| line.chomp}
        rescue StandardError => e
            puts "Error reading #{@desc_fname}: #{e.message}"
            "[No description]"
        end
    end

    # Create a Situation from an ID and hash
    # This data is from the JSON
    def self.from_hash id, data, fname
        situation = self.new id, fname
        situation.title = data['title']
        situation
    end

    # Read user input to populate the situation data
    def self.from_input id, fname
        situation = self.new id, fname
        situation.title = prompt_str "Title for Situation #{id}: "
        situation
    end
end
